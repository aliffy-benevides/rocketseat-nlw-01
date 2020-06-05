import { Request, Response } from 'express';
import knex from '../database/connection';

interface PointItem {
    item_id: number;
    point_id: number;
}

interface Point {
    id?: number;
    image: string;
    name: string;
    email: string;
    whatsapp: string;
    latitude: number;
    longitude: number;
    city: string;
    uf: string;
}

class PointsController {
    async index(req: Request, res: Response) {
        const { city, uf, items } = req.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.0.13:3333/uploads/${point.image}`
            }
        })

        return res.json(serializedPoints)
    }

    async show(req: Request, res: Response) {
        const { id } = req.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return res.status(400).json({ message: "Point not found." });
        }

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.0.13:3333/uploads/${point.image}`
        };

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title')

        return res.json({ point: serializedPoint, items });
    }

    async create(req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;

        const point: Point = {
            image: req.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        // transaction - dependência entre queries
        const trx = await knex.transaction();

        const insertedIds = await trx('points').insert(point)

        const point_id = insertedIds[0]
        point.id = point_id;

        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number): PointItem => {
                return {
                    item_id,
                    point_id
                }
            })

        await trx('point_items').insert(pointItems);

        await trx.commit();

        return res.json(point)
    }
}

export default PointsController;