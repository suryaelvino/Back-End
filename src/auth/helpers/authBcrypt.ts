import bcrypt from 'bcrypt';

export const hashPassword = (plainPassword: string): string => {
    try {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(plainPassword, salt);
        return hashedPassword;
    } catch (error) {
        throw error;
    }
};

export const comparePasswords = async (plainPassword: string, hashedPasswordFromDatabase: string): Promise<boolean> => {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPasswordFromDatabase);
        return match;
    } catch (error) {
        throw error;
    }
};
