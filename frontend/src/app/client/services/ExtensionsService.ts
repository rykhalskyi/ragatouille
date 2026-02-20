/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CallToolRequest } from '../models/CallToolRequest';
import type { CallToolResponse } from '../models/CallToolResponse';
import type { ExtensionTool } from '../models/ExtensionTool';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExtensionsService {
    /**
     * Get Connected Extension Tools
     * Returns a list of all currently registered and connected extension tools.
     * @returns ExtensionTool Successful Response
     * @throws ApiError
     */
    public static getConnectedExtensionToolsExtensionsConnectedToolsGet(): CancelablePromise<Array<ExtensionTool>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/extensions/connected_tools',
        });
    }
    /**
     * Call Extension Tool
     * Calls a command on a connected extension tool.
     * @param requestBody
     * @returns CallToolResponse Successful Response
     * @throws ApiError
     */
    public static callExtensionToolExtensionsCallToolPost(
        requestBody: CallToolRequest,
    ): CancelablePromise<CallToolResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/extensions/call_tool',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
