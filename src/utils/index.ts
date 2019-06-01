export const cleanAndSplitUserInput = (input: string): Set<string> => {
    const plain = input
        .toLowerCase()
        .replace(/[,.()]| and/g, ``)
        .replace(/[-/]|&amp;/g, ` `)
    const words = new Set(plain.split(` `))

    return words
}

export { SetUtils } from './SetUtils'
