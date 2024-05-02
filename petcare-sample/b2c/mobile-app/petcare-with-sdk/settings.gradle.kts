pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
        maven {
            url = uri("file:/Users/achintha/.m2/repository/")
        }
        maven {
            url = uri("https://maven.wso2.org/nexus/content/repositories/releases")
        }
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven {
            url = uri("file:/Users/achintha/.m2/repository/")
        }
        maven {
            url = uri("https://maven.wso2.org/nexus/content/repositories/releases")
        }
    }
}

rootProject.name = "petcare"
include(":app")
 