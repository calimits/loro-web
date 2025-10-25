import vd from "./Validators"
class ValidatorFactory{
    createValidator(val = ""){
        return new Error("Must implement this funciton");
    }
}

class ValidatorFormFactory extends ValidatorFactory{
    createValidator(val = ""){
        if (val === "name") return new vd.NameValidator();
        if (val === "email") return new vd.EmailValidator();
        if (val === "password") return new vd.PasswordValidator();
        if (val === "key") return new vd.AlwaysTrueValidator();
    }
}

export {ValidatorFormFactory}