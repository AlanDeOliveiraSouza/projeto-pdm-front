export function formatarDataParaBR(data: string): string {
    const [ano, mes, dia] = data.split('-').map(Number);
    let dataFormatada;

    if(dia < 10 && mes < 10) {
        dataFormatada = `0${dia}/0${mes}/${ano}`;
    } else if(dia < 10 ) {
        dataFormatada = `0${dia}/${mes}/${ano}`;
    } else if(mes < 10 ) {
        dataFormatada = `${dia}/0${mes}/${ano}`;
    } else {
        dataFormatada = `${dia}/${mes}/${ano}`;
    }

    return dataFormatada;
}

export function formatarDataParaISO(data: string): string {
    const [dia, mes, ano] = data.split('/').map(Number);

    let dataFormatada;

    if(dia < 10 && mes < 10) {
        dataFormatada = `${ano}-0${mes}-0${dia}`;
    } else if(dia < 10 ) {
        dataFormatada = `${ano}-${mes}-0${dia}`;
    } else if(mes < 10 ) {
        dataFormatada = `${ano}-0${mes}-${dia}`;
    } else {
        dataFormatada = `${ano}-${mes}-${dia}`;
    }

    return dataFormatada;
}

export function calcularAnosConhece(data: string): number {
    const [dia, mes, ano] = data.split('/').map(Number);
    if (!dia || !mes || !ano) return 0;

    const dataInicio = new Date(ano, mes - 1, dia);
    const hoje = new Date();
 
    let anos = hoje.getFullYear() - dataInicio.getFullYear();
    const m = hoje.getMonth() - dataInicio.getMonth();
 
    // Ajuste se o aniversário do conhecimento ainda não chegou no ano atual
    if (m < 0 || (m === 0 && hoje.getDate() < dataInicio.getDate())) {
        anos--;
    }

    return anos >= 0 ? anos : 0;
};