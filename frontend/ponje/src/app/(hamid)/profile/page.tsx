import Achievements from "./components/Achievements";
import FriendsList from "./components/FriendsList";
import MatchHistory from "./components/MatchHistory";
import Performance from "./components/Performance";
import PlayerBanner from "./components/PlayerBanner";
import ProgressBar from "./components/ProgressBar";
import SkillAnalytics from "./components/SkillAnalytics";
export default function Profile() {
    return (

        <div className="bg-[#151424] " style={{
            paddingTop: '5rem',
            paddingLeft: '10rem',
        }}>
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