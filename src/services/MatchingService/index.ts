import * as fs from 'fs'
import { Match } from './Match'
import { SetUtils } from '../../utils'
import { User } from '../UserService'

export class MatchingService {
    private static convertToCsv = (matches: Match[]) => {
        // tslint:disable-next-line:max-line-length
        let str = `user_id_a,user_name_a,user_id_b,user_name_b,company_id,company_name,identity_difference,common_interests,common_how_to_meet\r\n`

        for (const match of matches) {
            let line = ''

            line += `${match.userA.id},`
            line += `${match.userA.name},`
            line += `${match.userB.id},`
            line += `${match.userB.name},`
            line += `${match.userB.companyId},`
            line += `${match.userB.companyName},`
            line += `"${Array.from(match.identityDifference!).join(`,`)}",`
            line += `"${Array.from(match.commonInterests!).join(`,`)}",`
            line += `"${Array.from(match.commonHowToMeet!).join(`,`)}",`

            str += `${line}\r\n`
        }

        return str
    }

    public static createMatches = (users: User[]): Match[] => {
        const matches: Match[] = []

        while (users.length > 1) {
            const userToMatch = users.shift()!

            let topScore = 0
            let topCommonInterests = 0
            let bestMatchedUser: User = users[0]

            const match = new Match()

            for (let j = 0; j < users.length; j++) {
                const potentialMatch = users[j]
                const commonInterests = MatchingService.getCommonInterests(
                    userToMatch,
                    potentialMatch
                )
                const identityDifferences = MatchingService.getIdentityDifferences(
                    userToMatch,
                    potentialMatch
                )
                const commonHowToMeet = MatchingService.getCommonHowToMeet(
                    userToMatch,
                    potentialMatch
                )
                const score = commonInterests.size + identityDifferences.size + commonHowToMeet.size

                if (
                    commonInterests.size > topCommonInterests ||
                    (topCommonInterests === 0 && score > topScore)
                ) {
                    topScore = score
                    topCommonInterests = commonInterests.size
                    bestMatchedUser = potentialMatch

                    match.userA = userToMatch
                    match.userB = bestMatchedUser
                    match.commonInterests = commonInterests
                    match.identityDifference = identityDifferences
                    match.commonHowToMeet = commonHowToMeet
                }
            }

            // Remove best matched user from pool
            users = users.filter(user => user.id !== bestMatchedUser.id)
            matches.push(match)
        }

        return matches
    }

    private static getCommonHowToMeet = (userA: User, userB: User): Set<string> => {
        let commonHowToMeet: Set<string>

        commonHowToMeet = SetUtils.getIntersection(userA.howToMeet, userB.howToMeet)

        return commonHowToMeet
    }

    private static getCommonInterests = (userA: User, userB: User): Set<string> => {
        let commonInterests: Set<string>

        commonInterests = SetUtils.getIntersection(userA.interests, userB.interests)

        return commonInterests
    }

    private static getIdentityDifferences = (userA: User, userB: User): Set<string> => {
        let identityDifferences: Set<string>

        identityDifferences = SetUtils.getDifference(userA.identityKeywords, userB.identityKeywords)

        return identityDifferences
    }

    public static writeMatches = async (matches: Match[]) => {
        const csv = MatchingService.convertToCsv(matches)
        await fs.writeFileSync(`Matches.csv`, csv)
    }
}

export { Match } from './Match'
