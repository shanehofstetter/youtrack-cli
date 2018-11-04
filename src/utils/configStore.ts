import * as Configstore from "configstore";
import {PackageInformation} from "./packageInformation";

export const configStore: Configstore = new Configstore(PackageInformation.get().name, {});
