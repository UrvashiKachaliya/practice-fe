import { getActiveOffersService, getAllOffersAdminService, createOfferService, updateOfferService, deleteOfferService } from "../services/offers.Services.js";

export const getActiveOffers = async (req, res) => {
  try { res.json(await getActiveOffersService()); }
  catch (e) { res.status(500).json({ message: e.message }); }
};

export const getAllOffersAdmin = async (req, res) => {
  try { res.json(await getAllOffersAdminService()); }
  catch (e) { res.status(500).json({ message: e.message }); }
};

export const createOffer = async (req, res) => {
  try { res.status(201).json(await createOfferService(req.body)); }
  catch (e) { res.status(400).json({ message: e.message }); }
};

export const updateOffer = async (req, res) => {
  try { res.json(await updateOfferService(req.params.id, req.body)); }
  catch (e) { res.status(400).json({ message: e.message }); }
};

export const deleteOffer = async (req, res) => {
  try { res.json(await deleteOfferService(req.params.id)); }
  catch (e) { res.status(500).json({ message: e.message }); }
};
