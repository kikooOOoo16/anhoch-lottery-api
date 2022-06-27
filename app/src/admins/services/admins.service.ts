import {Injectable, Logger} from '@nestjs/common';
import {CreateAdminDTO} from "../dtos/create-admin.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {AdminDocument} from "../models/admin.model";
import {ProblemCreatingAdminException} from "../../exceptions/admin-related/problem-creating-admin.exception";
import {WrongMasterPasswordException} from "../../exceptions/admin-related/wrong-master-password.exception";
import {ProblemRetrievingAdminException} from "../../exceptions/admin-related/problem-retrieving-admin.exception";
import {NoAdminFoundException} from "../../exceptions/admin-related/no-admin-found.exception";
import {HelperService} from "../../common/services/helper.service";
import {UpdateAdminDTO} from "../dtos/update-admin.dto";
import {ProblemUpdatingAdminException} from "../../exceptions/admin-related/problem-updating-admin.exception";

@Injectable()
export class AdminsService {

    constructor(@InjectModel('Admin') private readonly adminModel: Model<AdminDocument>) {}

    async create({firstName, lastName, email, password, masterPassword}: CreateAdminDTO): Promise<AdminDocument> {
        AdminsService.verifyMasterPassword(masterPassword);

        try {
            const admin: AdminDocument = new this.adminModel({
                firstName,
                lastName,
                email,
                password
            });
            return await admin.save();
        } catch (e) {
            Logger.error(e, 'admins.service.ts: create()');
            HelperService.handleDuplicateKeyErr(e);

            throw new ProblemCreatingAdminException();
        }
    }

    async update(admin: AdminDocument, updateAdminDTO: Partial<UpdateAdminDTO>) {
        HelperService.checkIfObjectIsEmpty(updateAdminDTO);

        Object.assign(admin, updateAdminDTO);

        try {
            return await this.adminModel.findByIdAndUpdate(admin.id, {...admin}, {new: true});
        } catch (e) {
            Logger.error(e, 'users.service.ts: update()');
            throw new ProblemUpdatingAdminException();
        }
    }

    async findByEmail(email): Promise<AdminDocument> {
        let admin: AdminDocument;
        try {
            admin = await this.adminModel.findOne({email});
        } catch (e) {
            Logger.error(e, 'admins.service.ts: findByEmail()');
            throw new ProblemRetrievingAdminException();
        }

        if (!admin) {
            throw new NoAdminFoundException();
        }

        return admin;
    }

    async findById(id: string): Promise<AdminDocument> {
        try {
            return await this.adminModel.findById(id);
        } catch (e) {
            Logger.error(e, 'admins.service.ts: findById()');
            throw new ProblemRetrievingAdminException();
        }
    }

    private static verifyMasterPassword(password: string): void {
        if (password !== process.env.ADMIN_MASTER_PASSWORD) {
            throw new WrongMasterPasswordException();
        }
    }
}
