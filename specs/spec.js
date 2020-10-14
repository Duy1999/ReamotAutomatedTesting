export default function (spec) {
    /*spec.describe("Sign Up protocol", function () {
        spec.it("Sign In and Sign Up", async function () {
            await spec.press('LoginScreen.SignUp'); 
            await spec.pause(4000);
            await spec.fillIn('Register.Name', 'Duy Nguyen');
            await spec.pause(4000);
            await spec.fillIn('Register.Email', 'duy12@gmail.com');
            await spec.pause(4000);
            await spec.fillIn('Register.Password', 'duy1941999');
            await spec.pause(4000);
            await spec.fillIn('Register.ContactNumber', '0934104523');
            await spec.pause(4000);
            await spec.press('Register.SignUp');   
            await spec.pause(6000);         
            await spec.press('Verification.AnotherAccount');  
            await spec.pause(4000);    
            await spec.fillIn('LoginScreen.Email', 'quangduynguyen19@gmail.com');
            await spec.pause(4000);
            await spec.fillIn('LoginScreen.Password', 'duy1941999');
            await spec.pause(4000);
            await spec.press('LoginScreen.Signin');
        });        
    }); */

   /* spec.describe("Edit Profile", function () {
        spec.it("Working on it", async function () {
            await spec.press('Home.editProfile');
            await spec.pause(4000);
            await spec.fillIn('EditScreen.name', 'Duy1999');
            await spec.pause(4000);
            await spec.fillIn('EditScreen.contactNumber', '04123456');
            await spec.pause(4000);
            await spec.fillIn('EditScreen.address', '300 Avenue Street');
            await spec.pause(4000);
            await spec.press('EditScreen.saveProfile');
        });        
    }); */

  spec.describe("Edit Profile", function () {
        spec.it("Working on it", async function () {
            await spec.press('Home.goToDoctor');
            await spec.pause(4000);
            await spec.press('DoctorScreen.GiveAccess');
            await spec.pause(4000);
            await spec.fillIn('AddAccess.search', 'Phuoc');
            await spec.pause(4000);
            await spec.press('AddAccess.List');
            await spec.pause(4000);
            await spec.press('DoctorInfo');
            await spec.pause(4000);
            await spec.press('Doctor');
            await spec.pause(4000);
            await spec.press('Access.Revoke');
        });        
    }); 
    
}