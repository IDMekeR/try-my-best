import { useSelector } from 'react-redux';

const myFunc = () => {
    const { countryInfo, stateInfo, allAccountInfo } = useSelector((state: any) => state.commonData);

    const countryOptions: any = countryInfo?.data?.map((item: any) => {
        return {
            label: item.countryname,
            value: item.id.toString(),
            key: item.id,
        };
    });

    const stateOptions: any = stateInfo?.data?.map((item: any) => {
        return {
            label: item.statename,
            value: item.id.toString(),
            key: item.id,
        };
    });
    const accOptions: any = allAccountInfo?.data.map((acc: any) => {
        return {
            label: acc.acct_name,
            value: acc.id.toString(),
            key: acc.id,
            isBilling: acc.is_billing, 
            billingType: acc?.bill_type, 
            availableCredit: acc?.balance_credit
        };
    });

    return {
        countryOptions,
        stateOptions,
        accOptions,
    };
};

const GenderIdtOptions = [
    {
        label: 'Male',
        value: 'Male',
    },
    {
        label: 'Female',
        value: 'Female',
    },
    {
        label: 'Non-binary',
        value: 'Non-binary',
    },
    {
        label: 'Transgender',
        value: 'Transgender',
    },
];

const genderOptions = [
    {
        value: 'Male',
        label: 'Male',
    },
    {
        value: 'Female',
        label: 'Female',
    },
    {
        value: 'Other',
        label: 'Other',
    },
];

const occupationOptions = [
    {
        value: 'Physician',
        label: 'Physician',
    },
    {
        value: 'Security',
        label: 'Security',
    },
    {
        value: 'Business man',
        label: 'Business man',
    },
    {
        value: 'Social Worker',
        label: 'Social Worker',
    },
    {
        value: 'Engineer',
        label: 'Engineer',
    },
    {
        value: 'Others',
        label: 'Others',
    },
];

const handOptions = [
    {
        value: 'righthand',
        label: 'Right Hand',
    },
    {
        value: 'lefthand',
        label: 'Left Hand',
    },
];

const amplifierOptions = [
    {
        label: 'Zeto',
        value: 'Zeto',
    },
    {
        label: 'Deymed',
        value: 'Deymed',
    },
    {
        label: 'Mitsar',
        value: 'Mitsar',
    },
    {
        label: 'Brain Master',
        value: 'Brain Master',
    },
    {
        label: 'CGX',
        value: 'CGX',
    }
];

export { GenderIdtOptions, genderOptions, occupationOptions, handOptions, myFunc, amplifierOptions };
