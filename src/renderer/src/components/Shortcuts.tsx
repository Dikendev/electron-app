import { useState } from "react"

const ShortCuts = () => {
    const [isOpen, setIsOpen] = useState(false)

    if (!isOpen) return (
        <div className="shortCuts_button">
            <button onClick={openClose}>openClose</button>
        </div>
    )
    function openClose() {
        setIsOpen((prev) => !prev)
    }

    return (
        <div className="shortCuts">
            <button onClick={openClose}>openClose</button>
            <div>
                Início expediente
                <div>
                    <p>MacOs <code>command + 3</code></p>
                </div>

                <div>
                    <p>Windows <code>ctrl + 3</code></p>
                </div>

                <div>
                    <p>Linux <code>option + 3</code></p>
                </div>

            </div>

            <div>
                Início almoço
                <div>
                    <p>MacOs <code>command + 3</code></p>
                </div>

                <div>
                    <p>Windows <code>ctrl + 3</code></p>
                </div>

                <div>
                    <p>Linux <code>option + 3</code></p>
                </div>
            </div>

            <div>
                Fim almoço
                <div>
                    <p>MacOs <code>command + 3</code></p>
                </div>

                <div>
                    <p>Windows <code>ctrl + 3</code></p>
                </div>

                <div>
                    <p>Linux <code>option + 3</code></p>
                </div>
            </div>

            <div>
                Fim expediente
                <div>
                    <p>MacOs <code>command + 3</code></p>
                </div>

                <div>
                    <p>Windows <code>ctrl + 3</code></p>
                </div>

                <div>
                    <p>Linux <code>option + 3</code></p>
                </div>
            </div>
        </div>
    )
}

export default ShortCuts