import MatchHistory from "../components/MatchHistory";
import { ProgressBar } from "../components/ProgressBar";
import { PlayerBanner } from "../components/PlayerBanner";
import FriendsList from "../components/FriendsList";
import Achievements from "../components/Achievements";
import { Performance } from "../components/Performance";
import { SkillAnalytics } from "../components/SkillAnalytics";

export default function Profile() {
    return (
        <div className="bg-[#151424]">
            <PlayerBanner />
            <div className="grid grid-cols-4 gap-4">
                <div className="col-start-1 col-end-3 ...">
                    <Achievements />
                </div>
                <Performance />
                <div className="mt-8">
                <ProgressBar />
                </div>
                <div className="col-start-1 col-end-3 ...">
                    <MatchHistory />
                </div>
                <SkillAnalytics />
                <FriendsList />
            </div>
        </div>
    )
}