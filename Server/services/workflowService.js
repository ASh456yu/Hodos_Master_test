require('dotenv').config();
const amqp = require('amqplib');

// Create a workflowService object with methods
const workflowService = {
    connection: null,
    channel: null,
    isConnected: false,

    connect: async function () {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
            this.channel = await this.connection.createChannel();

            this.connection.on('error', (err) => {
                console.error('RabbitMQ Connection Error:', err);
                this.isConnected = false;
            });

            this.connection.on('close', () => {
                console.log('RabbitMQ Connection Closed');
                this.isConnected = false;
            });

            await this.channel.prefetch(1);

            this.isConnected = true;
            console.log('Connected to RabbitMQ');

        } catch (error) {
            console.error('Failed to connect to RabbitMQ:', error.message);
            throw error;
        }
    },

    sendMessage: async function (exchange, routingKey, queue, exchangeType, message) {
        
        if (!this.channel || !this.isConnected) {
            throw new Error('Cannot send Message: RabbitMQ not connected');
        }

        await this.channel.assertExchange(exchange, exchangeType, { durable: true });
        await this.channel.assertQueue(queue, { durable: true });

        await this.channel.bindQueue(queue, exchange, routingKey);

        this.channel.publish(exchange, routingKey, Buffer.from(message));

        // Note: We're not closing connection and channel here as that would break future uses
    },

    startConsuming: async function () {
        if (!this.channel || !this.isConnected) {
            console.error('Cannot start consuming: RabbitMQ not connected');
            return;
        }

        try {
            
        } catch (error) {
            console.error('Error setting up message consumer:', error);
            throw error;
        }
    },

    close: async function () {
        try {
            if (this.channel) await this.channel.close();
            if (this.connection) await this.connection.close();
            this.isConnected = false;
        } catch (error) {
            console.error('Error closing RabbitMQ connection:', error);
            throw error;
        }
    }
};

module.exports = { workflowService };