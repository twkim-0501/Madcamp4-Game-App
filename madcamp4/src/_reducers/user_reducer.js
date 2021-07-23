import { 
    LOGIN_USER
} from '../_actions/types';


export default function foo(state={}, action) {  // eslint-disable-next-line 
    switch (action.type) {
        case LOGIN_USER:
            return {...state, loginSuccess: action.payload}
    
        default:
            return state;
    }
}