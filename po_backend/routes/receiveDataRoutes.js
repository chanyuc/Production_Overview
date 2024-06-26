const express = require('express');
const router = express.Router();
const sequelize = require('../database');
const ReceiveData = require('../models/ReceiveData');

const DEFAULT_PAGE_SIZE = 13;
const MAX_PAGE_SIZE = 1001;
function calculateOffset(page, pageSize) {
    return (page - 1) * pageSize;
}

router.get('/receive-data/pagination', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || DEFAULT_PAGE_SIZE;
        pageSize = Math.min(pageSize, MAX_PAGE_SIZE);

        const offset = calculateOffset(page, pageSize);
        const receiveData = await ReceiveData.findAndCountAll({
            attributes: [
                [sequelize.literal("SUBSTRING(CarDate, 0, 5) + '-' + SUBSTRING(CarDate, 5, 2) + '-' + SUBSTRING(CarDate, 7, 2) + ' ' + SUBSTRING(CarDate, 9, 2) + ':00'"), 'DateTime'],
                [sequelize.fn('COUNT', sequelize.col('*')), 'OrderCount'],
            ],
            group: [
                sequelize.literal("SUBSTRING(CarDate, 0, 5) + '-' + SUBSTRING(CarDate, 5, 2) + '-' + SUBSTRING(CarDate, 7, 2) + ' ' + SUBSTRING(CarDate, 9, 2) + ':00'")
            ],
            order: [[sequelize.literal('DateTime'), 'DESC']],
            limit: pageSize,
            offset: offset,
            raw: true
        });
        
        const nextPage = page + 1;

        res.json({ 
            data: receiveData.rows,
            totalItems: receiveData.count,
            currentPage: page,
            pageSize: pageSize,
            nextPage: nextPage,
        });
    } catch (error) {
        console.error('Error fetching order data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// (CY): Query recent 1000 rows of RecvOrder data
router.get('/receive-data', async (req, res) => {
    try {
        const receiveData = await ReceiveData.findAll({
            order: [
                ['CarDate', 'DESC']
            ],
            limit: 1001
        });
        res.json(receiveData);
    } catch (error) {
        console.error('Error fetching order data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// (CY): Query recent 100 rows of RecvOrder data
router.get('/receive-data/recent', async (req, res) => {
    try {
        const receiveData = await ReceiveData.findAll({
            order: [
                ['CarDate', 'DESC']
            ],
            limit: 98
        });
        res.json(receiveData);
    } catch (error) {
        console.error('Error fetching recent order data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// (CY): Query the average of RecvOrder data
router.get('/receive-data/average', async (req, res) => {
    try {
        const receiveData = await ReceiveData.findAll({
            attributes: [
                [sequelize.literal("SUBSTRING(CarDate, 0, 5) + '-' + SUBSTRING(CarDate, 5, 2) + '-' + SUBSTRING(CarDate, 7, 2) + ' ' + SUBSTRING(CarDate, 9, 2) + ':00'"), 'DateTime'],
                [sequelize.fn('COUNT', sequelize.col('*')), 'OrderCount'],
            ],
            group: [
                sequelize.literal("SUBSTRING(CarDate, 0, 5) + '-' + SUBSTRING(CarDate, 5, 2) + '-' + SUBSTRING(CarDate, 7, 2) + ' ' + SUBSTRING(CarDate, 9, 2) + ':00'")
            ],
            order: [[sequelize.literal('DateTime'), 'DESC']],
            limit: 13,
            raw: true
        });
        res.json(receiveData);
    } catch (error) {
        console.error('Error fetching order data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;