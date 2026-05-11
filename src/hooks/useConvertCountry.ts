//hook para convertir el codigo de pais a su nombre completo
const converseCountry = (country: string | null | undefined) => {
    if (!country) return '';
    switch (country.toLocaleUpperCase()) {
        case 'CO': return 'Colombia';
        case 'US': return 'United States';
        case 'MX': return 'Mexico';
        case 'AR': return 'Argentina';
        case 'BR': return 'Brazil';
        case 'CL': return 'Chile';
        case 'PE': return 'Peru';
        case 'VE': return 'Venezuela';
        case 'EC': return 'Ecuador';
        case 'UY': return 'Uruguay';
        default: return country;
    }

}

export default converseCountry;