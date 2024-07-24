

    export const getAZBestSeller = async() => {

        try {
            const response = await fetch('/api/scraperV2', {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            return data
        } catch (error: any) {
            console.error(error.message);
            return error.message
        }


    }