import type { Request, Response, NextFunction } from 'express';
import { createJobRoleSchema, updateJobRoleSchema } from './jobs.schema';
import { createJobRole, listJobRoles, getJobRole, updateJobRole } from './jobs.service';

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = createJobRoleSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.flatten().fieldErrors });

        const role = await createJobRole(parsed.data);
        return res.status(201).json({ status: 'success', data: role });
    } catch (err) { next(err); }
}

export async function list(req: Request, res: Response, next: NextFunction) {
    try {
        const companyId = req.query.companyId as string;
        if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId query param required' });

        const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;
        const roles = await listJobRoles(companyId, { isActive });
        return res.json({ status: 'success', data: roles });
    } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
    try {
        const role = await getJobRole(req.params.id);
        if (!role) return res.status(404).json({ status: 'error', message: 'Job role not found' });
        return res.json({ status: 'success', data: role });
    } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = updateJobRoleSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.flatten().fieldErrors });

        const role = await updateJobRole(req.params.id, parsed.data);
        if (!role) return res.status(404).json({ status: 'error', message: 'Job role not found' });
        return res.json({ status: 'success', data: role });
    } catch (err) { next(err); }
}
