
import Rules from './components/Rules'
import OnlineFriendsInvite from './components/onlineFriendsInvite'
import PlayerCard from './components/PlayerCard'

const Friends: DisplayedInfo[] = [
  {
    "id": 93,
    "username": "Soukaina",
    "email": "sabbajisoukaina@gmail.com",
    "intraid": null,
    "googleId": "106733394767828313508",
    "twoFactor": true,
    "twoFactorSecret": "HZWBCGRNOBLTIQCE",
    "status": "ONLINE",
    "winRate": 0,
    "accuracy": 0,
    "consitency": 0,
    "reflex": 0,
    "gamePoints": 0,
    "rank": "UNRANKED",
    "level": 0,
    "experience": 0,
    "gameInvitesSent": 0,
    "createdAt": "2023-11-29T12:16:13.377Z",
    "updatedAt": "2023-11-29T13:30:53.411Z",
    "profile": {
      "id": 93,
      "bio": "I am a new player",
      "avatar": null,
      "userid": 93,
      "createdAt": "2023-11-29T12:16:13.377Z",
      "updatedAt": "2023-11-29T13:30:54.405Z"
    }
  }

]

const me: DisplayedInfo =
{
  "id": 93,
  "username": "Soukaina",
  "email": "sabbajisoukaina@gmail.com",
  "intraid": null,
  "googleId": "106733394767828313508",
  "twoFactor": true,
  "twoFactorSecret": "HZWBCGRNOBLTIQCE",
  "status": "ONLINE",
  "winRate": 0,
  "accuracy": 0,
  "consitency": 0,
  "reflex": 0,
  "gamePoints": 0,
  "rank": "UNRANKED",
  "level": 0,
  "experience": 0,
  "gameInvitesSent": 0,
  "createdAt": "2023-11-29T12:16:13.377Z",
  "updatedAt": "2023-11-29T13:30:53.411Z",
  "profile": {
    "id": 93,
    "bio": "I am a new player",
    "avatar": null,
    "userid": 93,
    "createdAt": "2023-11-29T12:16:13.377Z",
    "updatedAt": "2023-11-29T13:30:54.405Z"
  }
}


export type DisplayedInfo = {
  id: number;
  username: string;
  email: string;
  intraid: string | null;
  googleId: string;
  twoFactor: boolean;
  twoFactorSecret: string;
  status: string;
  winRate: number;
  accuracy: number;
  consitency: number;
  reflex: number;
  gamePoints: number;
  rank: string;
  level: number;
  experience: number;
  gameInvitesSent: number;
  createdAt: string;
  updatedAt: string;
  profile: {
    id: number;
    bio: string;
    avatar: string | null | undefined;
    userid: number;
    createdAt: string;
    updatedAt: string;
  };
};


export default function Gametest() {
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //     const fetchData = async () => {
  //         try {
  //                 // const data = await axios.get(`/users/${loggedUserId}`, {
  //                 const data = await axios.get(`/users/me`, {
  //                     headers: {
  //                         Authorization: `${localStorage.getItem('access_token')}`,
  //                     },
  //                 });
  //                 setUser(data.data);
  //                 setLoading(false);
  //                 console.log(data.data);
  //         } catch (err) {
  //             console.error(err);
  //             setLoading(false);
  //         }
  //     };

  //     fetchData();
  // }, []);

  // if (loading)
  //     return <Loader/>
  return (
    <div className=' min-h-screen bg-gradient-to-t from-[#2b2948] to-[#141321]'>
      <div className='grid grid-cols-3'>
        <div></div>
        <PlayerCard user={me} />
        <OnlineFriendsInvite users={Friends} />
        {/* <Rules /> */}
      </div>
      </div>
  );
}