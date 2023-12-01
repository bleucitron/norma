import { users } from '../../../../../../data/usersEvent.json';
export function load({ params }) {
    return {
        user: users[params.id - 1],
    }
}