class StringUtils {
    static normalizeWord = (word: string): string => {
        const removeLn = word.replace(/(\r\n|\n|\r)/gm, '')
        return this.removeAccents(removeLn)
    }

    static removeAccents = (word: string): string => {
        return word.normalize().replace(/[\u0300-\u036f]/g, '')
    }
}

export default StringUtils
