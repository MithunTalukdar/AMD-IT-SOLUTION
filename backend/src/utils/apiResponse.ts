export const success = (res: any, status: number, message: string, data?: any) => {
  return res.status(status).json({ success: true, message, ...(data !== undefined ? { data } : {}) });
};

export const error = (res: any, status: number, message: string, errors?: any) => {
  return res.status(status).json({ success: false, message, ...(errors ? { errors } : {}) });
};
