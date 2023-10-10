const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

module.exports = {
    createTransaction: async (req, res) => {
        const { amount, sender_id, receiver_id } = req.body;
        try {            
            const account = await prisma.bank_account_transactions.create({
                data: {
                    amount: amount,
                    source_account: {
                        connect: {id: sender_id}
                    },
                    destination_account: {
                        connect: {id: receiver_id}
                    }
                }
            })
    
            return res.json({
                data: account
            })
        } catch (error) {
            return res.json({
                data: error
            })            
        }
    },

    getTransactions: async (req, res) => {
        const accounts = await prisma.bank_account_transactions.findMany();
        return res.json({
            data: accounts
        });        
    },

    getTransactionById:  async (req, res) => {
        const accountData = await prisma.bank_account_transactions.findUnique({
            where: {
                id: parseInt(req.params.transaction)
            }
        })

        const sender = await prisma.bank_accounts.findUnique({
            where: {
                id: parseInt(accountData.source_account_id)
            }
        })

        const receiver = await prisma.bank_accounts.findUnique({
            where: {
                id: parseInt(accountData.destination_account_id)
            }
        })

        return res.json({
            data: accountData,
            source: sender,
            destination: receiver
        });
    }
}

