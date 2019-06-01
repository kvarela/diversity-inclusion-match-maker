import program from 'commander'
import { MatchingService, UserService } from './services'

program
    .action(async () => {
        const users = await UserService.getUsers()
        const matches = MatchingService.createMatches(users)
        await MatchingService.writeMatches(matches)
    })
    .parse(process.argv)
