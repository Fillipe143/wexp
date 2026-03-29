document.addEventListener("DOMContentLoaded", function (event) {
    const button = document.getElementById('pingButton');

    button.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/ping');
            if (!response.ok) throw new Error('Erro na requisição');

            const data = await response.json();

            M.toast({
                html: `Sucesso: ${data.message}`,
                displayLength: 3000,
                classes: 'green lighten-2',
                outDuration: 300,
                inDuration: 300
            });
        } catch (error) {
            M.toast({
                html: `Erro: ${error.message}`,
                displayLength: 3000,
                classes: 'red lighten-2',
                outDuration: 300,
                inDuration: 300
            });
        }
    });
});
