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
            const data = await prisma.bank_accounts.findUnique({
                where: {
                    id: parseInt(sender_id)
                }
            });

            const balance = await BigInt(data.balance)
            
            if(balance < BigInt(amount)){
                return res.json({
                    message: "Insufficient Balance"
                })
            }

            const transaction = await prisma.bank_account_transactions.create({
                data: {
                    amount: BigInt(amount),
                    source_account: {
                        connect: {id: parseInt(sender_id)}
                    },
                    destination_account: {
                        connect: {id: parseInt(receiver_id)}
                    }
                }
            })

            const senderAccount = await prisma.bank_accounts.update({
                where: {
                    id: parseInt(sender_id)
                },
                data: {
                    balance: balance - BigInt(amount)
                }
            })

            const receiverAccount = await prisma.bank_accounts.update({
                where: {
                    id: parseInt(receiver_id)
                },
                data: {
                    balance: balance + BigInt(amount)
                }
            })

            return res.json({
                data: transaction,
                sender: senderAccount,
                receiver: receiverAccount
            })
        } catch (error) {
            console.log(error.message);
            return res.json({
                data: error
            })            
        }
    },

    getTransactions: async (req, res) => {
        try {            
            const transactions = await prisma.bank_account_transactions.findMany();
            return res.json({
                data: transactions
            });        
        } catch (error) {
            return res.json({
                data: error,
                message: error.message
            })                
        }
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

