// noinspection JSUnusedGlobalSymbols

import { PageReference } from "lightning/uiAppsApi";

/**
 * For the original lightning/navigation mock that comes by default with
 * @salesforce/sfdx-lwc-jest, see:
 * https://github.com/salesforce/sfdx-lwc-jest/blob/main/src/lightning-mocks/navigation/navigation.js
 */
export const CurrentPageReference = jest.fn();

let _pageReference: PageReference, _replace: boolean;

const Navigate = Symbol('Navigate');
const GenerateUrl = Symbol('GenerateUrl');
export const NavigationMixin = (Base: any) => {
    return class extends Base {
        [Navigate](pageReference: PageReference, replace: boolean) {
            _pageReference = pageReference;
            _replace = replace;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-shadow
        [GenerateUrl](_pageReference: PageReference) {}
    };
};
NavigationMixin.Navigate = Navigate;
NavigationMixin.GenerateUrl = GenerateUrl;

/*
 * Tests do not have access to the internals of this mixin used by the
 * component under test so save a reference to the arguments the Navigate method is
 * invoked with and provide access with this function.
 */
export const getNavigateCalledWith = () => {
    return {
        pageReference: _pageReference,
        replace: _replace
    };
};
