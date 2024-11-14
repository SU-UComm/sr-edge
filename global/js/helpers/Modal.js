import hash from "object-hash";
import { Close } from "./index";

export function Modal({ content, uniqueId = "", describedby="image-gallery-modal" }) {

    let hashId = uniqueId;

    if (!uniqueId) {
        hashId = hash.MD5(
            JSON.stringify(content) + hash.MD5(JSON.stringify(describedby))
        );
    }

    return `
    <div data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="${hashId}">
        <span data-focus-scope-start="true" hidden=""></span>
        <div aria-describedby="${describedby}" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true">
            <div class="su-modal-content">
            ${content}
            </div>
        </div>
        <button type="button" class="su-component-close su-text-center" data-dismiss="modal">
            ${Close()}
            <span>Close</span>
        </button>
        <span data-focus-scope-end="true" hidden=""></span>
    </div>`;
};

export default Modal;