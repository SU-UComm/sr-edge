I want to create an educational story for developers.

The story should be about the benefits of using the Page Builder to enhance the user experience of a website.

The story should be interactive and engaging.

The story should be educational and informative.

The story should show code examples where necessary for illustration.


The focus of the story is to educate developer how and when (and when not to) use inline editing code in the outputted HTML.

We start with what we would normall do, output some html. return `<h1>${title}</h1>`

The journey unravells as we meet page builder, where we want to supoer charge editors.

The main points to note for inline editing are:
1. Standard ouput: <h1 data-sq-field="title">${title}</h1>
2. Conditional output needs to handle edit mode: ${title ? `<h1>${title}</h1>` : ${editMode ? `<h1 data-sq-field="title">${title}</h1>` : ''}
2a. This included error handing title.length === 0 throw New Error()
3. Always render "something" in the outputted HTML for Inline editing to look nice. Use a fallback if needed <div data-sq-field="title">Add a title</div>

Enter Edit mode.

This is what we are used to, perfect for public front end output.
export default {
    async main(args,info) {
        const { title } = args;

        return `<h1>${title}</h1>`;
    }
}

But sometimes we need to either:
- Render elements to an editor that the public should not see.
- Provide a really rich editorial experience, which means (currently) needing to render Edit mode content that is entirely different to what the public front end would see.

Now:

export default {
    async main(args, info) {
        // the context object for a component is very powerful
        const { assetId, url, editor } = info?.ctx;

        if(assetId){
            // this is the Matrix front end asset ID
            // fetch some data based on the ID
        }
        if(url){
            // this is the Matrix front end URL
            // fetch some data based on the URL
        }

        if(editor){
            // are we in APB edit mode or not?
            // determines when we can/should load edit mode content and data
        }


        const frontendOutput = `${title ? `<h1>${title}</h1>` : ''}`;
        
        const editOutput = `<h1 data-sq-field="title">${title}</h1>`;
        
        return `
            <section data-component="{component-name}">
                ${editor ? editOutput : frontendOutput}
            </section>
        `;
    }
}