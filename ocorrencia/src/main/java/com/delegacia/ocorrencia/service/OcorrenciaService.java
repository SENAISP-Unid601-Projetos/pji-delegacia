package com.delegacia.ocorrencia.service;

import com.delegacia.ocorrencia.entity.Ocorrencia;
import com.delegacia.ocorrencia.repositories.OcorrenciaReposity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OcorrenciaService {
    @Autowired
    private OcorrenciaReposity ocorrenciaReposity;

    public Ocorrencia addOcorrencia(Ocorrencia ocorrencia) {
        return ocorrenciaReposity.save(ocorrencia);
    }

    public List<Ocorrencia> findAll() {
        return ocorrenciaReposity.findAll();
    }

    public void deleteOcorrencia(long id) {
        ocorrenciaReposity.deleteById(id);
    }
}
