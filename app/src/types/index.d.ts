import {AdminDocument} from "../admins/models/admin.model";
import {UserDocument} from "../users/models/user.model";

export {};

declare global {
    namespace Express {
        interface Request {
            currentAdmin?: AdminDocument;
            currentUser?: UserDocument;
            session: any;
        }
    }
}