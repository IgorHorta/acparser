const Joi = require('@hapi/joi')
    .extend(require('@hapi/joi-date'));
const APLHA_NUMERIC_NO_WHITESPACE_REGEX = /^[a-zA-Z0-9]*$/;


module.exports = {
    endPosition: 250,
    types: [{
        // Tipo 0 - Header
        // Identifica o cabeçalho de cada arquivo por cadeia de extrato eletrônico*.
        type: {
            code: '0',
            name: 'Header',
            description: 'Identifica o cabeçalho de cada arquivo por cadeia de extrato eletrônico*.',
            endPosition: 250
        },
        fields: [{
            begin: 1,
            end: 1,
            name: 'Tipo de registro',
            description: 'Constante “0”: identifica o tipo de registro header (início do arquivo).',
            validate: (value) => Joi.number().required().valid(0).validate(value)
        },{
            begin: 2,
            end: 11,
            name: 'Estabelecimento Matriz',
            description: 'Número do estabelecimento matriz da cadeia de extrato eletrônico.',
            validate: (value) => Joi.string().regex(APLHA_NUMERIC_NO_WHITESPACE_REGEX).required().validate(value)
        },{
            begin: 12,
            end: 19,
            name: 'Data de processamento',
            description: 'AAAAMMDD – data em que o arquivo foi gerado.',
            validate: (value) => Joi.date().format('YYYYMMDD').required().validate(value)
        },{
            begin: 20,
            end: 27,
            name: 'Período inicial',
            description: 'AAAAMMDD – menor data de captura encontrada no movimento.',
            validate: (value) => Joi.date().format('YYYYMMDD').required().validate(value)
        },{
            begin: 28,
            end: 35,
            name: 'Período final',
            description: 'AAAAMMDD – maior data de captura encontrada no movimento.',
            validate: (value) => Joi.date().format('YYYYMMDD').required().validate(value)
        },{
            begin: 36,
            end: 42,
            name: 'Sequência',
            description: 'Número sequencial do arquivo. Nos casos de recuperação este dado será enviado como 9999999.',
            validate: (value) => Joi.number().required().validate(value)
        },{
            begin: 43,
            end: 47,
            name: 'Empresa adquirente',
            description: 'Constante Cielo.',
            validate: (value) => Joi.string().valid('CIELO').required().validate(value)
        },{
            begin: 48,
            end: 49,
            name: 'Opção de extrato',
            description: 'Opção de extrato',
            validate: (value) => Joi.string().required().valid('03', '04', '06', '07', '08', '09', '10').validate(value)
        },{
            begin: 50,
            end: 50,
            name: 'VAN',
            description: '“I” – OpenText (antiga GXS), “P” – TIVIT.',
            validate: (value) => Joi.string().required().valid('I', 'P').validate(value)
        },{
            begin: 51,
            end: 70,
            name: 'Caixa Postal',
            description: 'Informação obtida no formulário de cadastro na VAN',
            validate: (value) => Joi.string().validate(value)
        },{
            begin: 71,
            end: 73,
            name: 'Versão Layout',
            description: 'Constante “013”.',
            validate: (value) => Joi.string().valid('013').validate(value)
        },{
            begin: 71,
            end: 250,
            name: 'Uso Cielo',
            description: 'Em Branco. Reservado para Cielo.'
        }]
    },{
        type: {
            code: '1',
            name: 'Detalhe do Resumo de Operações (RO)',
            description: 'Grupo de vendas, ajustes ou cobrança de serviços. Permite identificar a origem dos lançamentos e as ações de manutenção.',
            endPosition: 250
        },
        fields: [{
            begin: 1,
            end: 1,
            name: 'Tipo de registro',
            description: 'Constante “1” - Identifica o tipo de registro detalhe do RO.',
            validate: (value) => Joi.number().required().valid(1).validate(value)
        },{
            begin: 2,
            end: 11,
            name: 'Estabelecimento Submissor',
            description: 'Número do estabelecimento e/ou filial onde a venda foi realizada.',
            validate: (value) => Joi.string().regex(APLHA_NUMERIC_NO_WHITESPACE_REGEX).required().validate(value)
        },{
            begin: 12,
            end: 18,
            name: 'Número do RO',
            description: 'Número do resumo de operação. Contêm informações referentes a um grupo de vendas realizadas em uma determinada data.',
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 19,
            end: 20,
            name: 'Parcela',
            description: `No caso de venda parcelada, será formatado com o número da
                parcela que está sendo liberada na data do envio do arquivo.
                No caso de venda à vista, será formatado com brancos.`
        },{
            begin: 21,
            end: 21,
            name: 'Filler',
            description: '"/" Vendas parceladas. "a" Aceleração das parcelas. " " Demais situações',
            validate: (value) => Joi.string().required().valid('/', 'A', ' ').validate(value)
        },{
            begin: 22,
            end: 23,
            name: 'Plano',
            description: `No caso de venda parcelada, será formatado com o maior número
                de parcelas encontradas naquele grupo de vendas. Se o RO tiver
                vendas em 03, 04 ou 06 parcelas, será preenchido com 06.
                Se for uma aceleração de parcelas, será formatado com a maior
                parcela acelerada. Exemplo: \n
                02A02 indica a aceleração da parcela 02 até a 02, ou seja,
                somente uma parcela.
                03A08 indica a aceleração da parcela 03 até a parcela 08
                do plano da venda, ou seja, foram aceleradas 06 parcelas.
                No caso de venda à vista, será formatado com brancos.`
        },{
            begin: 24,
            end: 25,
            name: 'Tipo de Transação',
            description: 'Código que identifica a transação',
            validate: (value) => Joi.string().required().valid('01', '02', '03', '04', '05').validate(value)
        },{
            begin: 26,
            end: 31,
            name: 'Data de apresentação',
            description: 'AAMMDD Data em que o RO foi transmitido para a Cielo.',
            validate: (value) => Joi.date().format('YYMMDD').required().validate(value)
        },{
            begin: 32,
            end: 37,
            name: 'Data prevista de pagamento',
            description: `AAMMDD Data prevista de pagamento. Na recuperação, pode ser
                atualizada após o processamento da transação ou ajuste.`,
            validate: (value) => Joi.date().format('YYMMDD').required().validate(value)
        },{
            begin: 38,
            end: 43,
            name: 'Data de envio ao banco',
            description: `AAMMDD
                Data em que o arquivo de pagamento foi enviado ao
                banco. Na recuperação, pode ser atualizada após o processamento
                da transação ou ajuste.`,
            validate: (value) => Joi.date().allow('0000').format('YYMMDD').required().validate(value)
        },{
            begin: 44,
            end: 44,
            name: 'Sinal do valor bruto',
            description: `"+" identifica valor a crédito.
                "-" identifica valor a débito.`,
            validate: (value) => Joi.string().required().valid('+', '-').validate(value)
        },{
            begin: 45,
            end: 57,
            name: 'Valor bruto',
            description: 'Somatória dos valores de venda.',
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 58,
            end: 58,
            name: 'Sinal do valor bruto',
            description: `"+" identifica valor a crédito.
                "-" identifica valor a débito.`,
            validate: (value) => Joi.string().required().valid('+', '-').validate(value)
        },{
            begin: 59,
            end: 71,
            name: 'Valor da taxa administrativa',
            description: 'Valor da taxa administrativa descontada sobre as vendas.',
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 72,
            end: 72,
            name: 'Sinal do valor rejeitado',
            description: `"+" identifica valor a crédito.
                "-" identifica valor a débito.`,
            validate: (value) => Joi.string().required().valid('+', '-').validate(value)
        },{
            begin: 73,
            end: 85,
            name: 'Valor rejeitado',
            description: `Se houver rejeição, será preenchido com a somatória das transações
                rejeitadas.`,
            validate: (value) => Joi.number().unsafe(true).validate(value)
        },{
            begin: 86,
            end: 86,
            name: 'Sinal do valor líquido',
            description: `"+" identifica valor a crédito.
                "-" identifica valor a débito.`,
            validate: (value) => Joi.string().required().valid('+', '-').validate(value)
        },{
            begin: 87,
            end: 99,
            name: 'Valor líquido (*)',
            description: 'Valor das vendas descontado o valor da taxa administrativa..',
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 100,
            end: 103,
            name: 'Banco',
            description: 'Código do banco no qual os valores foram depositados.'
        },{
            begin: 104,
            end: 108,
            name: 'Agência',
            description: 'Código da agência na qual os valores foram depositados.'
        },{
            begin: 109,
            end: 122,
            name: 'Conta-corrente / poupança',
            description: 'Conta-corrente / poupança na qual os valores foram depositados.'
        },{
            begin: 123,
            end: 124,
            name: 'Status do pagamento',
            description: `Identifica a situação em que se encontram os créditos enviados ao
                banco
                vide Tabela III. Na recuperação, o status é atualizado de
                acordo com o envio e retorno de confirmação de pagamento por
                parte do banco.`,
            validate: (value) => Joi.string().required().valid('00', '01', '02', '03').validate(value)
        },{
            begin: 125,
            end: 130,
            name: 'Quantidade de CVs aceitos',
            description: 'Quantidades de vendas aceitas no RO.'
        },{
            begin: 131,
            end: 132,
            name: 'Código do Produto (Desconsiderar)',
            description: `A partir de 01/03/2014, o Identificador do produto passou a ser
            enviado nas posições 233-235 com três caracteres.`
        },{
            begin: 133,
            end: 138,
            name: 'Quantidades de CVs rejeitados',
            description: 'Quantidade de vendas rejeitadas no RO.'
        },{
            begin: 139,
            end: 139,
            name: 'Identificador de revenda/aceleração',
            description: `Identifica as ocorrências de manutenção em transações parceladas
                na loja:
                - Revenda
                - Aceleração
                Brancos (nenhuma ocorrência)`,
            validate: (value) => Joi.string().required().valid('R', 'A', ' ').validate(value)
        },{
            begin: 140,
            end: 145,
            name: 'Data de captura da transação',
            description: `AAMMDD - Data em que a transação foi capturada pela Cielo.
                Na recuperação, pode ser atualizada após o processamento da
                transação ou ajuste.`,
            validate: (value) => Joi.date().format('YYMMDD').required().validate(value)
        },{
            begin: 146,
            end: 147,
            name: 'Origem do ajuste',
            description: `Identifica o tipo de ajuste preenchido se o tipo de
            transação for:
            02 Ajuste crédito
            03 Ajuste débito
            04 Ajuste aluguel`
        },{
            begin: 148,
            end: 160,
            name: 'Valor complementar',
            description: `Valor do saque quando o produto for igual a 36 ou valor do Agro
            Electron para transações dos produtos 22
            23 ou 25`,
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 161,
            end: 161,
            name: 'Identificador de Antecipação',
            description: `Identificador de antecipação do RO:
             " " Não antecipado;
            "A" Antecipado Cielo ou Alelo;
            "C" Antecipado no banco Cessão de Recebíveis.`,
            validate: (value) => Joi.string().required().valid(' ', 'A', 'C').validate(value)
        },{
            begin: 162,
            end: 170,
            name: 'Número da operação de Antecipação',
            description: `Identifica o número da operação de Antecipação apresentada no
            registro tipo 5
            campo 12 ao 20, associada ao RO antecipado na
            Cielo/Alelo ou cedido no banco.
            Conterá zeros, caso o RO não tenha sido antecipado.`
        },{
            begin: 171,
            end: 171,
            name: 'Sinal do valor Bruto antecipado',
            description: `"+" identifica valor a crédito.
                "-" identifica valor a débito.`,
            validate: (value) => Joi.string().required().valid('+', '-').validate(value)
        },{
            begin: 172,
            end: 184,
            name: 'Valor Bruto Antecipado',
            description: `Valor bruto antecipado, fornecido quando o RO for
            antecipado/cedido. Será preenchido com zeros quando não houver
            antecipação.`,
            validate: (value) => Joi.number().unsafe(true).validate(value)
        },{
            begin: 185,
            end: 187,
            name: 'Bandeira',
            description: 'Código da Bandeira',
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 188,
            end: 209,
            name: 'Número Único do RO',
            description: `Número Único de identificação do RO formatado da seguinte forma:
                Primeira parte (fixa) 15 posições fixas: identifica o resumo mantendo o seu histórico na Cielo;
                Segunda parte (variável) 07 posições variáveis: Identifica as alterações realizadas no RO.`,
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 210,
            end: 213,
            name: 'Taxa Administrativa (*)',
            description: 'Percentual de taxa administrativa aplicado no valor da transação.',
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 214,
            end: 218,
            name: 'Tarifa Administrativa (*)',
            description: 'Tarifa cobrada por transação.',
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 219,
            end: 222,
            name: 'Taxa de Garantia (*)',
            description: 'Percentual de desconto aplicado sobre transações Electron Pré-Datado.',
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 223,
            end: 224,
            name: 'Meio de Captura',
            description: `Caso a venda tenha sido reprocessada, o sistema enviará o meio de captura 06:
            Meio de captura manual. Neste caso, desconsiderar o valor informado no número lógico do
            terminal.`,
            validate: (value) => Joi.number().unsafe().required().validate(value)
        },{
            begin: 225,
            end: 232,
            name: 'Número lógico do terminal',
            description: `Número lógico do terminal onde foi efetuada a venda. Quando o meio de captura for igual a 06,
            desconsiderar o número lógico do terminal, pois este será um número interno da Cielo.`,
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 233,
            end: 235,
            name: 'Código do Produto',
            description: 'Código que identifica o produto',
            validate: (value) => Joi.number().required().validate(value)
        },{
            begin: 236,
            end: 245,
            name: 'Matriz de Pagamento',
            description: 'Estabelecimento matriz de pagamento.',
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 246,
            end: 246,
            name: 'Reenvio de Pagamento',
            description: `" "S" dentifica que este resumo está sendo reenviado no extrato. Desconsiderar o pagamento
            enviado anteriormente.
            "N" não refere-se à reenvio de pagamento.`,
            validate: (value) => Joi.string().required().valid('S', 'N').validate(value)
        },{
            begin: 247,
            end: 247,
            name: 'Conceito aplicado',
            description: `Identifica o conceito aplicado no resumo apresentado:
            " "- Antigo
            "N"- Novo`,
            validate: (value) => Joi.string().required().valid(' ', 'N').validate(value)
        },{
            begin: 248,
            end: 249,
            name: 'Grupo de Cartões',
            description: `Identifica o grupo de cartões conforme abaixo:
            " "- Brancos. Serviço não atribuído
            01 - Cartão emitido no Brasil
            02 - Cartão emitido no exterior
            03 - MDR por Tipo de Cartão - Inicial
            04 - MDR por Tipo de Cartão - Intermediário
            05 - MDR por Tipo de Cartão - Superior`,
            validate: (value) => Joi.string().required().valid('  ', '01', '02', '03', '04', '05').validate(value)
        },{
            begin: 250,
            end: 250,
            name: 'Uso Cielo',
            description: 'Em Branco. Reservado para Cielo.'
        }]
        // Tipo 2 - Detalhe do Comprovante de Venda (CV)
        // Detalhe das vendas ou ajustes agrupados em um RO. Conforme regras de segurança, todos os registros que possuírem número de cartão apresentarão o número truncado.
    },{
        type: {
            code: '2',
            name: 'Detalhe do Comprovante de Venda (CV)',
            description: 'Detalhe das vendas ou ajustes agrupados em um RO. Conforme regras de segurança, todos os registros que possuírem número de cartão apresentarão o número truncado.',
            endPosition: 250
        },
        fields: [{
            begin: 1,
            end: 1,
            name: 'Tipo de registro',
            description: 'Constante “2” – identifica o tipo de registro de detalhe do Comprovante de Venda (CV).',
            validate: (value) => Joi.number().required().valid(2).validate(value)
        },{
            begin: 2,
            end: 11,
            name: 'Estabelecimento Submissor',
            description: 'Número do estabelecimento e/ou filial onde a venda foi realizada.',
            validate: (value) => Joi.string().regex(APLHA_NUMERIC_NO_WHITESPACE_REGEX).required().validate(value)
        },{
            begin: 12,
            end: 18,
            name: 'Número do RO',
            description: 'Número do resumo de operação. Contêm informações referentes a um grupo de vendas realizadas em uma determinada data.',
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 19,
            end: 37,
            name: 'Número do cartão truncado',
            description: 'Número do cartão truncado: número do cartão que efetuou a compra com número truncado. Conterá zeros para compras via mobile payment ou comércio eletrônico, sendo para o último opcional.'
        },{
            begin: 38,
            end: 45,
            name: 'Data da venda/ajuste',
            description: 'AAAAMMDD – Data em que a venda ou o ajuste foi realizado.',
            validate: (value) => Joi.date().format('YYYYMMDD').required().validate(value)
        },{
            begin: 46,
            end: 46,
            name: 'Sinal do valor da compra ou valor da parcela',
            description: '“+” identifica valor a crédito.“-” identifica valor a débito.',
            validate: (value) => Joi.string().required().valid('+', '-').validate(value)
        },{
            begin: 47,
            end: 59,
            name: 'Valor da compra ou valor da parcela',
            description: 'Valor da compra ou da parcela que foi liberada, no caso de venda parcelada na loja.',
            validate: (value) => Joi.number().required().validate(value)
        },{
            begin: 60,
            end: 61,
            name: 'Parcela',
            description: 'No caso de venda parcelada, será formatado com o número da parcela que está sendo liberada. No caso de venda à vista, será formatado com zeros.',
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 62,
            end: 63,
            name: 'Total de parcelas',
            description: 'Número total de parcelas da venda. No caso de venda à vista, será formatado com zero.',
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 64,
            end: 66,
            name: 'Motivo da rejeição',
            description: 'Caso não possua rejeição o campo é formatado em branco'
        },{
            begin: 67,
            end: 72,
            name: 'Código de autorização',
            description: 'Código de autorização da transação. Este número não é único e pode se repetir. Para efeito de conciliação deverá ser combinado com outras chaves.'
        },{
            begin: 73,
            end: 92,
            name: 'TID',
            description: 'Identificação da transação realizada no comércio eletrônico ou mobile payment.'
        },{
            begin: 93,
            end: 98,
            name: 'NSU/DOC',
            description: 'Número sequencial, também conhecido como DOC (número do documento), que identifica a transação no dia em que ela foi realizada. Este número não é único e pode se repetir. Caso a venda tenha sido reprocessada, o NSU pode ser alterado.'
        },{
            begin: 99,
            end: 111,
            name: 'Valor Complementar',
            description: 'Valor da transação de Saque com cartão de Débito ou AgroElectron de acordo com indicador de produto do RO.',
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 112,
            end: 113,
            name: 'Dig - Cartão',
            description: 'Número de Dígitos do Cartão',
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 114,
            end: 126,
            name: 'Valor total da venda no caso de Parcelado Loja',
            description: 'O valor total da venda parcelada na loja é enviado somente no arquivo de vendas em todas as parcelas. Para os demais casos estará vazio.',
            validate: (value) => Joi.number().unsafe(true).validate(value)
        },{
            begin: 127,
            end: 139,
            name: 'Valor da próxima parcela',
            description: 'O valor total da venda parcelada na loja é enviado somente no arquivo de vendas em todas as parcelas. Para os demais casos estará vazio.',
            validate: (value) => Joi.number().unsafe(true).validate(value)
        },{
            begin: 140,
            end: 148,
            name: 'Número da Nota Fiscal',
            description: 'Número da nota fiscal para estabelecimentos que capturam esta informação no POS. Quando não disponível será formatado com zeros',
            validate: (value) => Joi.number().unsafe(true).validate(value)
        },{
            begin: 149,
            end: 152,
            name: 'Indicador de cartão emitido no exterior',
            description: `Identifica se o cartão que realizou a compra foi emitido no exterior conforme abaixo:
            “0000” - Serviço não atribuído
            “0001” - Cartão emitido no Brasil
            “0002” - Cartão emitido no exterior`,
            validate: (value) => Joi.string().required().valid('0000', '0001', '0002').validate(value)
        },{
            begin: 153,
            end: 160,
            name: 'Número lógico do terminal',
            description: 'Número lógico do terminal onde foi efetuada a venda. Quando o Meio de Captura for 06, desconsiderar esta informação.',
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 161,
            end: 162,
            name: 'Identificador de taxa de embarque ou valor de entrada',
            description: `Identificação da transação referente à taxa de embarque ou valor de entrada:
            TX - Taxa de embarque;
            VE - Valor da entrada;
            Brancos - para demais tipos de transação.`,
            validate: (value) => Joi.string().required().valid('TX', 'VE', '  ').validate(value)
        },{
            begin: 163,
            end: 182,
            name: 'Referência/código do pedido',
            description: 'Referência ou código do pedido informado em uma transação mobile payment e comércio eletrônico. Quando não disponível, será formatado com brancos'
        },{
            begin: 183,
            end: 188,
            name: 'Hora da transação',
            description: 'Hora da transação apresentada no formado HHMMSS. Essa informação será gerada somente nos registros de venda do arquivo de venda com CV original. Nos demais casos, o campo será formatado com zeros.',
            validate: (value) => Joi.date().format('HHmmss').required().validate(value)
        },{
            begin: 189,
            end: 217,
            name: 'Número único da transação',
            description: 'Número Único que identifica cada transação',
            validate: (value) => Joi.number().unsafe(true).required().validate(value)
        },{
            begin: 218,
            end: 218,
            name: 'Indicador Cielo Promo',
            description: 'Identificador do Produto Cielo Promo = “S”. Identifica que a venda participou de campanha na Plataforma Promocional. Caso contrário, será formatado com brancos.',
            validate: (value) => Joi.string().required().valid(' ', 'S').validate(value)
        },{
            begin: 219,
            end: 250,
            name: 'Uso Cielo',
            description: 'Em Branco. Reservado para Cielo.'
        }]
    },{
        // Tipo 9 - Trailer
        // Indica o final do arquivo
        type: {
            code: '9',
            name: 'Trailer',
            description: 'Indica o final do arquivo.',
            endPosition: 250
        },
        fields: [{
            begin: 1,
            end: 1,
            name: 'Tipo de registro',
            description: 'Constante “9” – Identifica o tipo de registro de detalhe trailer (final do arquivo).'
        },{
            begin: 2,
            end: 12,
            name: 'Total de registro',
            description: 'Número total de registros, os quais não incluem header e trailer.'
        },{
            begin: 13,
            end: 250,
            name: 'Total de registro',
            description: 'Número total de registros, os quais não incluem header e trailer.'
        }]
    }]
};