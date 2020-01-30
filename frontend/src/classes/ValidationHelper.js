export class ValidationHelper
{
    static requiredMessage()
    {
        return "This Field is required";
    }

    static minimumCharactersMessage(minChars)
    {
        return "Please enter minimum " + minChars + " characters";
    }

    static validEmailMessage()
    {
        return "Please enter a valid email"
    }

    static validNumberMessage()
    {
        return "Please enter a valid number";
    }

    static positiveNumberMessage()
    {
        return "Please enter a valid number greater than 0";
    }
}

export default ValidationHelper;