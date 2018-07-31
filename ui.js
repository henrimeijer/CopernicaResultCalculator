class UI {
    // Show alert messages
    showAlert(message, className) {
        // Clear any remaining alerts
        this.clearAlert();
        // Create div
        const div  =  document.createElement('div');
        // Add classes
        div.className = className;
        // Add text
        div.appendChild(document.createTextNode(message));
        // Get parent
        const container = document.querySelector('.searchContainer');
        // Get search box
        const alertContainer = document.querySelector('.alertContainer');
        // Insert alert
        container.insertBefore(div, alertContainer);
    
        // Timeout after 3 sec
        setTimeout(() => {
          this.clearAlert();
        }, 5000);
      }

    // Clear alert message
    clearAlert() {
        const currentAlert = document.querySelector('.alert');
    
        if(currentAlert){
          currentAlert.remove();
        }
      }

    // Hide loader function
    hideLoader() {
      document.getElementById('loading').style.display = 'none';
    }

    // Disable button while loading
    disableButton() {
      document.getElementById("button").disabled = true;
    }

  }