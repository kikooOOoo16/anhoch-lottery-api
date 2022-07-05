import {Injectable, Logger} from '@nestjs/common';
import {CreateCommercialDTO} from "../dtos/create-commercial.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Commercial, CommercialDocument} from "../models/commercial.model";
import {
    ProblemCreatingCommercialException
} from "../../exceptions/commercials-related/problem-creating-commercial.exception";
import {
    ProblemRemovingOldProfileImageException
} from "../../exceptions/user-related/user-images/problem-removing-old-profile-image.exception";
import {
    NoCommercialVideoProvidedException
} from "../../exceptions/commercials-related/no-commercial-video-provided.exception";
import {ModifyCommercialsWatchDurationDTO} from "../dtos/modify-commercials-watch-duration.dto";
import {
    ProblemUpdatingCommercialsWatchDurationException
} from "../../exceptions/commercials-related/problem-updating-commercials-watch-duration.exception";
import {HelperService} from "../../common/services/helper.service";
import {ModifyCommercialActiveStatusDTO} from "../dtos/modify-commercial-active-status.dto";
import {
    NoCommercialVideoFoundException
} from "../../exceptions/commercials-related/no-commercial-video-found.exception";
import {
    ProblemRetrievingCommercialException
} from "../../exceptions/commercials-related/problem-retrieving-commercial.exception";
import {
    CommercialAlreadyHasThatStatusException
} from "../../exceptions/commercials-related/commercial-already-has-that-status.exception";
import {
    ProblemUpdatingCommercialsIsActiveStatusException
} from "../../exceptions/commercials-related/problem-updating-commercials-is-active-status.exception";
import {UpdateCommercialDTO} from "../dtos/update-commercial.dto";
import {
    ProblemUpdatingCommercialException
} from "../../exceptions/commercials-related/problem-updating-commercial.exception";

const fs = require('fs');

@Injectable()
export class CommercialsService {

    constructor(@InjectModel('Commercial') private readonly commercialModel: Model<CommercialDocument>) {}

    async create({name, website}: CreateCommercialDTO, file: Express.Multer.File): Promise<CommercialDocument> {
        if (!file) {
            throw new NoCommercialVideoProvidedException();
        }

        const currentlySetWatchDuration: number = await this.getCurrentWatchDurationValue();

        const commercial: CommercialDocument = new this.commercialModel({
            name,
            minimumWatchSeconds: currentlySetWatchDuration ? currentlySetWatchDuration : 5,
            website: website ? website : null,
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype
        });

        try {
            return await commercial.save();
        } catch (e) {
            Logger.error(e, 'commercials.service: create()');
            CommercialsService.removeCommercialVideoFile(commercial, process.env.COMMERCIAL_VIDEOS_DIR);

            HelperService.handleDuplicateKeyErr(e);
            throw new ProblemCreatingCommercialException();
        }
    }

    async update(id: string, updateCommercialDTO: UpdateCommercialDTO): Promise<CommercialDocument> {
        const commercial: CommercialDocument = await this.findById(id);

        Object.assign(commercial, updateCommercialDTO);

        try {
            return await commercial.save();
        } catch (e) {
            Logger.error(e, 'commercials.service: update()');
            throw new ProblemUpdatingCommercialException();
        }
    }

    async delete(id: string): Promise<CommercialDocument> {
        let deletedCommercial: CommercialDocument;
        try {
            deletedCommercial = await this.commercialModel.findByIdAndDelete(id);
        } catch (e) {
            Logger.error(e, 'commercials.service: delete()');
        }

        if (!deletedCommercial) {
            throw new NoCommercialVideoFoundException();
        }

        CommercialsService.removeCommercialVideoFile(deletedCommercial, process.env.COMMERCIAL_VIDEOS_DIR);

        return deletedCommercial;
    }

    async findById(id: string): Promise<CommercialDocument> {
        let foundCommercial: CommercialDocument;

        try {
            foundCommercial = await this.commercialModel.findById(id);
        } catch (e) {
            Logger.error(e, 'commercials.service: findById()');
            throw new ProblemRetrievingCommercialException();
        }

        if (!foundCommercial) {
            throw new NoCommercialVideoFoundException();
        }

        return foundCommercial;
    }

    async getAll(): Promise<CommercialDocument[]> {
        try {
            return await this.commercialModel.find({});
        } catch (e) {
            Logger.error(e, 'commercials.service: getAll()');
        }
    }

    async getRandomActiveCommercial(): Promise<CommercialDocument> {
        let activeCommercials: CommercialDocument[];

        try {
            activeCommercials = await this.commercialModel.find({
                isActive: true
            });
        } catch (e) {
            Logger.error(e, 'commercials.service: getRandomActiveCommercial()');
            throw new ProblemRetrievingCommercialException();
        }

        if (activeCommercials.length === 0) {
            throw new NoCommercialVideoFoundException();
        }

        if (activeCommercials.length > 1) {
            const randomNumber = Math.floor(Math.random() * activeCommercials.length);
            return activeCommercials[randomNumber];
        }

        return activeCommercials[0];
    }

    async modifyWatchDuration({minimumWatchSeconds}: ModifyCommercialsWatchDurationDTO): Promise<any> {
        try {
            return await this.commercialModel.updateMany({}, {
                minimumWatchSeconds
            });
        } catch (e) {
            Logger.error(e, 'commercials.service: modifyWatchDuration()');
            throw new ProblemUpdatingCommercialsWatchDurationException();
        }
    }

    async modifyActiveStatus(commercialId: string, {isActive}: ModifyCommercialActiveStatusDTO): Promise<CommercialDocument> {
        const commercial: CommercialDocument = await this.findById(commercialId);

        if (commercial.isActive === isActive) {
            throw new CommercialAlreadyHasThatStatusException(isActive);
        }

        commercial.isActive = isActive;

        try {
            return await commercial.save()
        } catch (e) {
            Logger.error(e, 'commercials.service: modifyActiveStatus()');
            throw new ProblemUpdatingCommercialsIsActiveStatusException();
        }
    }

    private static removeCommercialVideoFile(commercialVideo: CommercialDocument, commercialVideoDirectory: string) {
        if (commercialVideo) {
            try {
                fs.unlinkSync(`${process.env.UPLOADED_FILES_DESTINATION}${commercialVideoDirectory}${commercialVideo.filename}`)
            } catch (e) {
                Logger.error(e, 'commercials.service: removeCommercialVideoFile');
                throw new ProblemRemovingOldProfileImageException();
            }
        }
    }

    private async getCurrentWatchDurationValue(): Promise<number> {
        let commercial: CommercialDocument;

        try {
            commercial = await this.commercialModel.findOne({});
        } catch (e) {
            Logger.error(e, '')
        }

        return commercial ? commercial.minimumWatchSeconds : null;
    }
}
