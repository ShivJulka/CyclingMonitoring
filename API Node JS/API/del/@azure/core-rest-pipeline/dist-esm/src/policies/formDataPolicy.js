// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import FormData from "form-data";
/**
 * The programmatic identifier of the formDataPolicy.
 */
export const formDataPolicyName = "formDataPolicy";
/**
 * A policy that encodes FormData on the request into the body.
 */
export function formDataPolicy() {
    return {
        name: formDataPolicyName,
        async sendRequest(request, next) {
            if (request.formData) {
                prepareFormData(request.formData, request);
            }
            return next(request);
        }
    };
}
async function prepareFormData(formData, request) {
    const requestForm = new FormData();
    for (const formKey of Object.keys(formData)) {
        const formValue = formData[formKey];
        if (Array.isArray(formValue)) {
            for (const subValue of formValue) {
                requestForm.append(formKey, subValue);
            }
        }
        else {
            requestForm.append(formKey, formValue);
        }
    }
    request.body = requestForm;
    request.formData = undefined;
    const contentType = request.headers.get("Content-Type");
    if (contentType && contentType.indexOf("multipart/form-data") !== -1) {
        request.headers.set("Content-Type", `multipart/form-data; boundary=${requestForm.getBoundary()}`);
    }
    try {
        const contentLength = await new Promise((resolve, reject) => {
            requestForm.getLength((err, length) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(length);
                }
            });
        });
        request.headers.set("Content-Length", contentLength);
    }
    catch (e) {
        // ignore setting the length if this fails
    }
}
//# sourceMappingURL=formDataPolicy.js.map