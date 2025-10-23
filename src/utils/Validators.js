class Validator{
    validate(text) {
        return new Error("Validate function not implemented");
    }
}

class EmailValidator extends Validator{
    validate(text){
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regexEmail.test(text);
    }
}

class NameValidator extends Validator{
    validate(text){
        const regexName = /[a-zA-Z0-9_]+/
        return regexName.test(text);
    }
}

class PasswordValidator extends Validator{
    validate(text){
        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[/?@$!%*?&])[A-Za-z\d/?@$!%*?&]{8,30}$/;
        return regexPassword.test(text);
    }
}

class AlwaysTrueValidator extends Validator{
    validate(text){
        return true;
    }
}

const validateData = (validator = new Validator(), text) => {
        return validator.validate(text);
    }

export default {
    EmailValidator,
    NameValidator,
    PasswordValidator,
    AlwaysTrueValidator,
    validateData
}