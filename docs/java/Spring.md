
# Annotations

@Configuration:
This class defines the beans that should be managed by Spring container.

- Spring will scan this class
- Look for methods annotated with @Bean
- Invoke those methods
- Register the returned objects as beans in the container

@Bean:
This annotation is used to define a bean.

- Spring will invoke this method
- Register the returned object as a bean in the container

@Component:
This annotation is used to mark a class as a Spring component.

- Spring will scan this class
- Register it as a bean in the container

@ComponentScan:
This annotation is used to enable component scanning.

- Spring will scan the specified package for components
- Register them as beans in the container

@Service:
This annotation is used to mark a class as a Spring service.

- Spring will scan this class
- Register it as a bean in the container

@Repository:
This annotation is used to mark a class as a Spring repository.

- Spring will scan this class
- Register it as a bean in the container

@Autowired:
This annotation is used to inject beans into other beans.

- Spring will look for a bean of the specified type
- Inject it into the annotated field

Why autowired is bad?

- It tightly couples the beans together
- It makes the code harder to test
- It makes the code harder to maintain

What should we do instead of Autowired?

- Use constructor injection
- Use setter injection
- Use field injection (not recommended)

@RequiredArgsConstructor:
This annotation is used to generate a constructor with required arguments.

- Spring will generate a constructor with arguments for all final fields
- These arguments will be injected by Spring