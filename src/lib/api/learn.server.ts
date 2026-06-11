import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { supabase, query } from '@/lib/supabase';

export const getTracks = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      ecosystem: z.enum(['EVM', 'SUI_MOVE', 'APTOS_MOVE', 'SOLANA_RUST', 'GENERAL']).optional(),
      difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    })
  )
  .handler(async ({ data }) => {
    const filters: Record<string, unknown> = { is_published: true };
    if (data.ecosystem) filters.ecosystem = data.ecosystem;
    if (data.difficulty) filters.difficulty = data.difficulty;

    const { data: tracks, error } = await query('tracks', {
      select: '*, modules(id)',
      filters,
      order: { column: 'order', ascending: true },
    });

    if (error) throw error;

    return (tracks || []).map((track: any) => ({
      ...track,
      _count: { modules: track.modules?.length || 0 },
      modules: undefined,
    }));
  });

export const getTrackById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { data: track, error } = await query('tracks', {
      select: '*, modules(*, quizzes(id, pass_mark, quiz_questions(id)))',
      filters: { id: data.id },
      single: true,
    });

    if (error) throw error;
    if (!track) throw new Error('Track not found');

    return track;
  });

export const getTrackProgress = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      trackId: z.string().uuid(),
      userId: z.string().uuid(),
      accessToken: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const { trackId, userId } = data;

    const { data: progress, error: progressError } = await query('course_progress', {
      select: '*, modules(id, title, order)',
      filters: { user_id: userId, 'modules.track_id': trackId },
    });

    if (progressError) throw progressError;

    const { count: totalModules, error: countError } = await query('modules', {
      select: 'id',
      count: 'exact',
      head: true,
      filters: { track_id: trackId },
    });

    if (countError) throw countError;

    const total = totalModules || 0;
    const completedCount = (progress || []).filter((p: any) => p.completed).length;

    return {
      progress: progress || [],
      totalModules: total,
      completedCount,
      percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0,
    };
  });

export const getModuleById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { data: mod, error } = await query('modules', {
      select: '*, tracks(id, title, ecosystem), quizzes(*, quiz_questions(*, quiz_options(id, option_text)))',
      filters: { id: data.id },
      single: true,
    });

    if (error) throw error;
    if (!mod) throw new Error('Module not found');

    return mod;
  });

export const completeModule = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      moduleId: z.string().uuid(),
      userId: z.string().uuid(),
      accessToken: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const { moduleId, userId } = data;

    const { data: existing } = await query('course_progress', {
      select: 'id',
      filters: { user_id: userId, module_id: moduleId },
      single: true,
    });

    let result;

    if (existing) {
      const { data: updated, error } = await supabase
        .from('course_progress')
        .update({ completed: true, completed_at: new Date().toISOString() }, { id: existing.id });

      if (error) throw error;
      result = updated?.[0];
    } else {
      const { data: created, error } = await supabase
        .from('course_progress')
        .insert({ user_id: userId, module_id: moduleId, completed: true, completed_at: new Date().toISOString() });

      if (error) throw error;
      result = created?.[0];
    }

    return result;
  });

export const getQuizById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { data: quiz, error } = await query('quizzes', {
      select: '*, modules(id, title), quiz_questions(*, quiz_options(id, option_text))',
      filters: { id: data.id },
      single: true,
    });

    if (error) throw error;
    if (!quiz) throw new Error('Quiz not found');

    return quiz;
  });

export const submitQuizAttempt = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      quizId: z.string().uuid(),
      userId: z.string().uuid(),
      accessToken: z.string(),
      answers: z.array(
        z.object({
          questionId: z.string().uuid(),
          optionId: z.string().uuid(),
        })
      ),
    })
  )
  .handler(async ({ data }) => {
    const { quizId, userId, answers } = data;

    const { data: quiz, error: quizError } = await query('quizzes', {
      select: '*, quiz_questions(*, quiz_options(*))',
      filters: { id: quizId },
      single: true,
    });

    if (quizError || !quiz) throw new Error('Quiz not found');

    const questions = quiz.quiz_questions || [];
    let correctCount = 0;
    const totalQuestions = questions.length;

    for (const answer of answers) {
      const question = questions.find((q: any) => q.id === answer.questionId);
      if (question) {
        const correctOption = (question.quiz_options || []).find((o: any) => o.is_correct);
        if (correctOption && correctOption.id === answer.optionId) {
          correctCount++;
        }
      }
    }

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= quiz.pass_mark;

    const { data: attempt, error: attemptError } = await supabase
      .from('quiz_attempts')
      .insert({ user_id: userId, quiz_id: quizId, score, passed });

    if (attemptError) throw attemptError;

    return {
      attempt: attempt?.[0],
      score,
      passed,
      correctCount,
      totalQuestions,
      passMark: quiz.pass_mark,
    };
  });

export const getResources = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      ecosystem: z.enum(['EVM', 'SUI_MOVE', 'APTOS_MOVE', 'SOLANA_RUST', 'GENERAL']).optional(),
      type: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const filters: Record<string, unknown> = { is_published: true };
    if (data.ecosystem) filters.ecosystem = data.ecosystem;
    if (data.type) filters.type = data.type;

    const { data: resources, error } = await query('resources', {
      select: '*',
      filters,
      order: { column: 'created_at', ascending: false },
    });

    if (error) throw error;

    return resources || [];
  });

export const createTrack = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      accessToken: z.string(),
      title: z.string().min(1),
      description: z.string().optional(),
      ecosystem: z.enum(['EVM', 'SUI_MOVE', 'APTOS_MOVE', 'SOLANA_RUST', 'GENERAL']).default('GENERAL'),
      difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('BEGINNER'),
      iconUrl: z.string().url().optional(),
      isPublished: z.boolean().default(false),
      order: z.number().default(0),
    })
  )
  .handler(async ({ data }) => {
    const { accessToken, ...trackData } = data;

    const { data: track, error } = await supabase
      .from('tracks')
      .insert({
        title: trackData.title,
        description: trackData.description,
        ecosystem: trackData.ecosystem,
        difficulty: trackData.difficulty,
        icon_url: trackData.iconUrl,
        is_published: trackData.isPublished,
        order: trackData.order,
      });

    if (error) throw error;

    return track?.[0];
  });

export const updateTrack = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      accessToken: z.string(),
      id: z.string().uuid(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      ecosystem: z.enum(['EVM', 'SUI_MOVE', 'APTOS_MOVE', 'SOLANA_RUST', 'GENERAL']).optional(),
      difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
      iconUrl: z.string().url().optional(),
      isPublished: z.boolean().optional(),
      order: z.number().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { accessToken, id, ...updateData } = data;

    const processed: Record<string, unknown> = {};
    if (updateData.title !== undefined) processed.title = updateData.title;
    if (updateData.description !== undefined) processed.description = updateData.description;
    if (updateData.ecosystem !== undefined) processed.ecosystem = updateData.ecosystem;
    if (updateData.difficulty !== undefined) processed.difficulty = updateData.difficulty;
    if (updateData.iconUrl !== undefined) processed.icon_url = updateData.iconUrl;
    if (updateData.isPublished !== undefined) processed.is_published = updateData.isPublished;
    if (updateData.order !== undefined) processed.order = updateData.order;

    const { data: track, error } = await supabase
      .from('tracks')
      .update(processed, { id });

    if (error) throw error;

    return track?.[0];
  });

export const createModule = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      accessToken: z.string(),
      trackId: z.string().uuid(),
      title: z.string().min(1),
      description: z.string().optional(),
      content: z.string().optional(),
      order: z.number().default(0),
    })
  )
  .handler(async ({ data }) => {
    const { accessToken, ...moduleData } = data;

    const { data: mod, error } = await supabase
      .from('modules')
      .insert({
        track_id: moduleData.trackId,
        title: moduleData.title,
        description: moduleData.description,
        content: moduleData.content,
        order: moduleData.order,
      });

    if (error) throw error;

    return mod?.[0];
  });

export const updateModule = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      accessToken: z.string(),
      id: z.string().uuid(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      content: z.string().optional(),
      order: z.number().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { accessToken, id, ...updateData } = data;

    const processed: Record<string, unknown> = {};
    if (updateData.title !== undefined) processed.title = updateData.title;
    if (updateData.description !== undefined) processed.description = updateData.description;
    if (updateData.content !== undefined) processed.content = updateData.content;
    if (updateData.order !== undefined) processed.order = updateData.order;

    const { data: mod, error } = await supabase
      .from('modules')
      .update(processed, { id });

    if (error) throw error;

    return mod?.[0];
  });

export const createQuiz = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      accessToken: z.string(),
      moduleId: z.string().uuid(),
      passMark: z.number().min(0).max(100).default(70),
      questions: z.array(
        z.object({
          questionText: z.string().min(1),
          order: z.number().default(0),
          options: z.array(
            z.object({
              optionText: z.string().min(1),
              isCorrect: z.boolean(),
            })
          ),
        })
      ),
    })
  )
  .handler(async ({ data }) => {
    const { accessToken, moduleId, passMark, questions } = data;

    const { data: existingQuiz } = await query('quizzes', {
      select: 'id',
      filters: { module_id: moduleId },
      single: true,
    });

    if (existingQuiz) {
      throw new Error('Quiz already exists for this module');
    }

    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({ module_id: moduleId, pass_mark: passMark });

    if (quizError) throw quizError;

    const quizId = quiz?.[0]?.id;

    for (const q of questions) {
      const { data: question, error: qError } = await supabase
        .from('quiz_questions')
        .insert({ quiz_id: quizId, question_text: q.questionText, order: q.order });

      if (qError) throw qError;

      const questionId = question?.[0]?.id;

      if (q.options.length > 0) {
        const { error: oError } = await supabase
          .from('quiz_options')
          .insert(
            q.options.map((o) => ({
              question_id: questionId,
              option_text: o.optionText,
              is_correct: o.isCorrect,
            }))
          );

        if (oError) throw oError;
      }
    }

    const { data: fullQuiz } = await query('quizzes', {
      select: '*, quiz_questions(*, quiz_options(*))',
      filters: { id: quizId },
      single: true,
    });

    return fullQuiz;
  });

export const addResource = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      accessToken: z.string(),
      title: z.string().min(1),
      url: z.string().url(),
      type: z.string().optional(),
      ecosystem: z.enum(['EVM', 'SUI_MOVE', 'APTOS_MOVE', 'SOLANA_RUST', 'GENERAL']).default('GENERAL'),
      isPublished: z.boolean().default(false),
    })
  )
  .handler(async ({ data }) => {
    const { accessToken, ...resourceData } = data;

    const { data: resource, error } = await supabase
      .from('resources')
      .insert({
        title: resourceData.title,
        url: resourceData.url,
        type: resourceData.type,
        ecosystem: resourceData.ecosystem,
        is_published: resourceData.isPublished,
      });

    if (error) throw error;

    return resource?.[0];
  });

export const deleteResource = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      accessToken: z.string(),
      id: z.string().uuid(),
    })
  )
  .handler(async ({ data }) => {
    const { error } = await supabase.from('resources').delete({ id: data.id });

    if (error) throw error;

    return { success: true };
  });
