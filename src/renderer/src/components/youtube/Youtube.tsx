import { useEffect, useRef } from "react"
import YouTubePlayer from 'youtube-player';

const Youtube = () => {
    const youtubeRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        const player = YouTubePlayer(youtubeRef.current, {
            videoId: 'M7lc1UVf-VE',
        });

        return () => {
            playerRef.current = player;
            playerRef.current.playVideo().then(() => {
                console.log('Starting to play player1. It will take some time to buffer video before it starts playing.');
            });
        }
    }, [])

    const stop = async () => {
        console.log('playerRef?.current', playerRef.current)
        playerRef.current.mute()
    }
    const play = () => {
        console.log('pauseVideo', playerRef.current)
        playerRef.current.pauseVideo();
    }

    return (
        <div>
            <div ref={youtubeRef} id="youtube"></div>
            <button onClick={stop}>
                stop
            </button>
            <button onClick={play}>
                play
            </button>
        </div>
    )
}

export default Youtube
