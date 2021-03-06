import { dbService } from "fbase";
import React, { useEffect, useState } from "react"

const Home = ({ userObj }) => {
    const [tweet, setTweet] = useState("");
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        dbService.collection("tweets").onSnapshot((snapshot) => {
            const tweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTweets(tweetArray);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("tweets").add({
            text: tweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        })
        setTweet("");
    }
    const onChange = (event) => {
        const {target: {value}} = event;
        setTweet(value);
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={tweet} onChange={onChange} type="text" placeholder="What's your mind?" maxLength={120} />
                <input type="submit" value="Tweet" />
                <div>
                    {tweets.map(tweet => {
                        return (
                        <div key={tweet.id}>
                            <h4>{tweet.text}</h4>
                        </div> )
                    })}
                </div>
            </form>
        </div>
    )
}
export default Home;