export class SetUtils {
    public static getDifference = (setA: Set<any>, setB: Set<any>): Set<any> => {
        const differenceFromA = new Set([...setA].filter(x => !setB.has(x)))
        const differenceFromB = new Set([...setB].filter(x => !setA.has(x)))

        return new Set([...differenceFromA, ...differenceFromB])
    }

    public static getIntersection = (setA: Set<any>, setB: Set<any>): Set<any> => {
        const intersection = new Set([...setA].filter(x => setB.has(x)))

        return intersection
    }
}
