class Copernica {
    async getDocumentResults(documentNumber, accessToken) {
        const documentResponse = await fetch(`https://api.copernica.com/v1/old/document/${documentNumber}/events?access_token=${accessToken}`);

        // Throw success message
        if(documentResponse.status === 200){
            ui.showAlert('API call successful, calculating results...', 'alert alert-success');
            // Disable button
            ui.disableButton();
        }
        
        // Throw error 400 bad request message
        if(documentResponse.status === 400){
            ui.showAlert('Error 400: Bad API request', 'alert alert-danger');
            // Call hide loader function from UI
            ui.hideLoader();
        }

        const document = await documentResponse.json();

        return {
            document
        }
    }
}