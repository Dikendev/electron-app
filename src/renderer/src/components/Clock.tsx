import { useEffect, useState } from "react"

const Clock = () => {
    const [ctime, setTime] = useState(new Date().toLocaleTimeString())

    const updateTime = () => {
        setTime(new Date().toLocaleTimeString())
    }

    useEffect(() => {
        setInterval(updateTime)
    }, [])

    return <h1 className="ts">{ctime}</h1>
}

export default Clock