const passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const validateAge = (_: any, value: any) => {
    const birth = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    if (age < 3) {
        return Promise.reject('Age must be at least 3 years old.');
    }

    return Promise.resolve();
};

const formatter = (value: any) => {
    const cleaned = ('' + value).replace(/\D/g, '');

    // Capture the groups we want
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    // If there was no match, return the original value
    if (!match) return value;

    // Otherwise, return the formatted phone number
    return `(${match[1]}) ${match[2]}-${match[3]}`;
};

const parser = (value: any) => {
    // Remove all non-digits
    const cleaned: any = ('' + value).replace(/\D/g, '');
    // If the cleaned value is empty or NaN, return null
    if (cleaned === '' || isNaN(cleaned)) {
        return null;
    }
    // Return only the digits
    return parseInt(cleaned);
};
const validatePhone = (rule: any, value: any) => {
    const pattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    if (value && !pattern.test(value)) {
        return Promise.reject('Please enter a valid US phone number');
    } else if (Number.isNaN(value)) {
        return Promise.reject('Please enter number');
    } else {
        return Promise.resolve();
    }
};
const validateConfirmPassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: any) {
        if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('The two passwords that you entered do not match!'));
    },
});
export { validateAge, validatePhone, parser, formatter, passwordPattern, validateConfirmPassword };
