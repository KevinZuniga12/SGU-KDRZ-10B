package utez.edu.mx.sgukdzrserver.modules.person;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.sgukdzrserver.modules.person.dto.PersonRequest;
import utez.edu.mx.sgukdzrserver.modules.person.dto.PersonResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PersonService {

    private final PersonRepository personRepository;

    @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    /**
     * Obtener todas las personas
     */
    @Transactional(readOnly = true)
    public List<PersonResponse> getAllPersons() {
        return personRepository.findAll()
                .stream()
                .map(PersonResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Obtener una persona por ID
     */
    @Transactional(readOnly = true)
    public PersonResponse getPersonById(Long id) {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Persona no encontrada con ID: " + id));
        return PersonResponse.fromEntity(person);
    }

    /**
     * Crear una nueva persona
     */
    public PersonResponse createPerson(PersonRequest request) {
        // Validar que el email no exista
        if (personRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Ya existe una persona con el correo electrónico: " + request.getEmail());
        }

        Person person = new Person();
        person.setFullName(request.getFullName());
        person.setEmail(request.getEmail());
        person.setPhoneNumber(request.getPhoneNumber());

        Person savedPerson = personRepository.save(person);
        return PersonResponse.fromEntity(savedPerson);
    }

    /**
     * Actualizar una persona existente
     */
    public PersonResponse updatePerson(Long id, PersonRequest request) {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Persona no encontrada con ID: " + id));

        // Validar que el email no esté siendo usado por otra persona
        if (personRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new RuntimeException("El correo electrónico ya está en uso por otra persona");
        }

        person.setFullName(request.getFullName());
        person.setEmail(request.getEmail());
        person.setPhoneNumber(request.getPhoneNumber());

        Person updatedPerson = personRepository.save(person);
        return PersonResponse.fromEntity(updatedPerson);
    }

    /**
     * Eliminar una persona
     */
    public void deletePerson(Long id) {
        if (!personRepository.existsById(id)) {
            throw new RuntimeException("Persona no encontrada con ID: " + id);
        }
        personRepository.deleteById(id);
    }

    /**
     * Buscar persona por email
     */
    @Transactional(readOnly = true)
    public PersonResponse getPersonByEmail(String email) {
        Person person = personRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Persona no encontrada con email: " + email));
        return PersonResponse.fromEntity(person);
    }
}

