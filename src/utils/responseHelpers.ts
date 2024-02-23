import { LANGUAGES } from "@/config/constants"
import EnglishResponses from "@/config/eng.ts"

const buildResponse = (code: string, lng = LANGUAGES.ENGLISH): string => {
    switch (lng) {
        case LANGUAGES.ENGLISH:
            return EnglishResponses[code]
        default:
            throw new Error('Language is compulsory')
    }
}

export default buildResponse