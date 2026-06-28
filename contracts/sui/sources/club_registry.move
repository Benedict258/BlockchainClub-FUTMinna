module blockchainclub::club_registry {
    use std::string::{Self, String};
    use sui::event;
    use sui::object;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    const BADGE_PIONEER: u8 = 0;
    const BADGE_TOP_BUILDER: u8 = 1;
    const BADGE_TOP_LEARNER: u8 = 2;
    const BADGE_MOST_ACTIVE: u8 = 3;
    const BADGE_COMMUNITY_STAR: u8 = 4;
    const BADGE_EVENT_CHAMPION: u8 = 5;
    const BADGE_FIRST_COMMIT: u8 = 6;
    const BADGE_TEAM_PLAYER: u8 = 7;
    const BADGE_GOAL_SETTER: u8 = 8;
    const BADGE_STREAK_MASTER: u8 = 9;

    const CATEGORY_EVENT: u8 = 0;
    const CATEGORY_LEARN: u8 = 1;
    const CATEGORY_BUILD: u8 = 2;
    const CATEGORY_COMMUNITY: u8 = 3;

    struct LeaderboardEntry has key {
        id: UID,
        student: address,
        event_points: u64,
        learn_points: u64,
        build_points: u64,
        community_points: u64,
        total_points: u64,
        badge_count: u64,
    }

    struct Certificate has key {
        id: UID,
        student: address,
        tier: u8,
        track: String,
        cohort_year: u16,
        portfolio_url: String,
        issued_at: u64,
    }

    struct Badge has key {
        id: UID,
        student: address,
        badge_type: u8,
        name: String,
        description: String,
        earned_at: u64,
    }

    struct AdminCap has key {
        id: UID,
    }

    struct PointsAwarded has copy, drop {
        student: address,
        category: u8,
        amount: u64,
        new_total: u64,
    }

    struct BadgeMinted has copy, drop {
        student: address,
        badge_type: u8,
    }

    struct CertificateIssued has copy, drop {
        student: address,
        tier: u8,
        cohort_year: u16,
    }

    fun init(ctx: &mut TxContext) {
        transfer::transfer(
            AdminCap { id: object::new(ctx) },
            tx_context::sender(ctx),
        );
    }

    public fun register_entry(
        _cap: &AdminCap,
        student: address,
        ctx: &mut TxContext,
    ) {
        transfer::transfer(
            LeaderboardEntry {
                id: object::new(ctx),
                student,
                event_points: 0,
                learn_points: 0,
                build_points: 0,
                community_points: 0,
                total_points: 0,
                badge_count: 0,
            },
            tx_context::sender(ctx),
        );
    }

    public fun award_points(
        _cap: &AdminCap,
        entry: &mut LeaderboardEntry,
        category: u8,
        amount: u64,
    ) {
        if (category == CATEGORY_EVENT) {
            entry.event_points = entry.event_points + amount;
        } else if (category == CATEGORY_LEARN) {
            entry.learn_points = entry.learn_points + amount;
        } else if (category == CATEGORY_BUILD) {
            entry.build_points = entry.build_points + amount;
        } else if (category == CATEGORY_COMMUNITY) {
            entry.community_points = entry.community_points + amount;
        };

        entry.total_points = entry.event_points + entry.learn_points
            + entry.build_points + entry.community_points;

        event::emit(PointsAwarded {
            student: entry.student,
            category,
            amount,
            new_total: entry.total_points,
        });
    }

    public fun mint_badge(
        _cap: &AdminCap,
        student: address,
        badge_type: u8,
        name_bytes: vector<u8>,
        description_bytes: vector<u8>,
        ctx: &mut TxContext,
    ) {
        let name = string::utf8(name_bytes);
        let description = string::utf8(description_bytes);

        transfer::transfer(
            Badge {
                id: object::new(ctx),
                student,
                badge_type,
                name,
                description,
                earned_at: tx_context::epoch_timestamp_ms(ctx),
            },
            student,
        );

        event::emit(BadgeMinted { student, badge_type });
    }

    public fun issue_certificate(
        _cap: &AdminCap,
        student: address,
        tier: u8,
        track_bytes: vector<u8>,
        cohort_year: u16,
        portfolio_url_bytes: vector<u8>,
        ctx: &mut TxContext,
    ) {
        let track = string::utf8(track_bytes);
        let portfolio_url = string::utf8(portfolio_url_bytes);

        transfer::transfer(
            Certificate {
                id: object::new(ctx),
                student,
                tier,
                track,
                cohort_year,
                portfolio_url,
                issued_at: tx_context::epoch_timestamp_ms(ctx),
            },
            student,
        );

        event::emit(CertificateIssued { student, tier, cohort_year });
    }
}
