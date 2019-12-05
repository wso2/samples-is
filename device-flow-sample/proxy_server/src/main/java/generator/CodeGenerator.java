package generator;

import org.springframework.context.annotation.Scope;

import java.util.UUID;

@Scope("singleton")
public class CodeGenerator {

    public CodeGenerator() {

    }

    private static CodeGenerator codeGenerator = new CodeGenerator();

    public static CodeGenerator getInstance() {

        if (codeGenerator == null) {

            synchronized (CodeGenerator.class) {

                if (codeGenerator == null) {

                    /* instance will be created at request time */
                    codeGenerator = new CodeGenerator();
                }
            }
        }
        return codeGenerator;

    }

    /**
     * Generate a random string.
     */
    public String getAuthReqId() {

        UUID authReqId = UUID.randomUUID();
        return authReqId.toString();

    }

    public String getRandomID() {

        UUID authReqId = UUID.randomUUID();
        return authReqId.toString();

    }

}
