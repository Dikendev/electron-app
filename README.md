# electron-app

This app aims to automate sheet management from Nova Coop, used internally at Consistem. It is an Electron application built with TypeScript and integrates Google authentication to facilitate easy updates without manual intervention.

The requirement to this app work is:

  1. The sheet must exist with the correct title in the month and year format (MMM/YYYY).

  2. All the days, starting from **/25 to **/25.

  3. The header must be exactly as demonstrated above:
    - DIAS
    - HORÁRIO INÍCIO
    - HORÁRIO DE TÉRMINO
    - HORAS TRABALHADAS

<!-- ### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
``` -->

## How to Get Credentials Keys

### Step 1: Access Google Cloud Console
  Visit [Google Cloud Console](https://console.cloud.google.com/).


### Step 2: Navigate to APIs & Services
  1. Click on **APIs & Services** in the left-hand menu.
  
  <br/>


<img src="./resources/first_step.gif" alt="dikendev" /> 

### Step 3: Create a Service Account

  1. Go to **Credentials**
  2. Click on **Manage service accounts**
  3. Click **Create Service Account**

  <br/>


<img src="./resources/second_step.gif" alt="dikendev" /> 

  <br/>

  4. Enter a description, assing the **Owner** role, then **Continue** and **Done**
    
  <br/>

<img src="./resources/third_step.gif" alt="dikendev" /> 

### Step 4: Generate Access Key

  1. Locate the newly created service account.
  2. Click **Actions** > **Manage keys**
  3. Click **Add Key** > **Create new Key**
  4. Select **JSON** and click **Create**

  <br/>

<img src="./resources/fourth_step.gif" alt="dikendev" /> 

  <br/>

  5. The JSON key file will be downloaded to your computer. Store it securely.
 
### Step 5: Add the credentials to APP

  1. Open the app
  2. Click on **Config**

  <br/>


<img src="./resources/credential_app.gif" alt="dikendev" /> 

  <br/>

  3. The client email and private key are located in the previously downloaded JSON file from Google. (Use the values without the quotation marks.)
  4. The ID is located in the Google Sheet URL after the d/ and before the next /.
  
  <br/>


<img src="./resources/add_credential.svg" alt="dikendev" /> 
  
  <br/>

  4. Click on **save**

  <br/>

<img src="./resources/save_credential.gif" alt="dikendev" /> 

  5. If all steps are completed successfully, the view will enable the action buttons and display the total working time for the current month.




